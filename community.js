import { db, storage } from './firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// DOM refs
const postContent = document.getElementById('postContent');
const submitPostBtn = document.getElementById('submitPost');
const imageUpload = document.getElementById('imageUpload');
const videoUpload = document.getElementById('videoUpload');
const postsContainer = document.getElementById('postsContainer');

// Post handler
submitPostBtn.addEventListener('click', async () => {
  const content = postContent.value.trim();
  const imageFiles = imageUpload.files;
  const videoFile = videoUpload.files[0];

  if (!content && imageFiles.length === 0 && !videoFile) {
    alert("Please write something or upload media.");
    return;
  }

  submitPostBtn.textContent = "Posting...";
  submitPostBtn.disabled = true;

  try {
    let imageURLs = [];
    for (const file of imageFiles) {
      const imgRef = storageRef(storage, `community/images/${Date.now()}-${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      imageURLs.push(url);
    }

    let videoURL = "";
    if (videoFile) {
      const vidRef = storageRef(storage, `community/videos/${Date.now()}-${videoFile.name}`);
      await uploadBytes(vidRef, videoFile);
      videoURL = await getDownloadURL(vidRef);
    }

    await addDoc(collection(db, "posts"), {
      text: content,
      timestamp: Timestamp.now(),
      images: imageURLs,
      video: videoURL,
      likes: 0,
      comments: [] // array of { text, timestamp }
    });

    postContent.value = "";
    imageUpload.value = "";
    videoUpload.value = "";
    loadPosts();
  } catch (e) {
    console.error("Post failed:", e);
    alert("❌ Failed to post.");
  }

  submitPostBtn.textContent = "Post";
  submitPostBtn.disabled = false;
});

async function loadPosts() {
  postsContainer.innerHTML = "<p>Loading posts...</p>";

  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  postsContainer.innerHTML = "";
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = docSnap.id;
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    let mediaHTML = "";
    if (data.images?.length > 0) {
      mediaHTML += data.images.map(url => `<img src="${url}" class="post-image" />`).join('');
    }
    if (data.video) {
      mediaHTML += `<video src="${data.video}" class="post-video" controls></video>`;
    }

    postDiv.innerHTML = `
      <p>${data.text}</p>
      ${mediaHTML}
      <small>${data.timestamp?.toDate().toLocaleString()}</small>

      <div class="post-actions">
        <button class="like-btn" data-id="${id}">👍 Like (${data.likes || 0})</button>
        <button class="share-btn" data-text="${data.text}">🔗 Share</button>
      </div>

      <div class="comments">
        <input type="text" placeholder="Write a comment..." class="comment-input" />
        <button class="comment-btn" data-id="${id}">💬 Comment</button>
        <div class="comment-list">
          ${(data.comments || []).map(c => `<p>💬 ${c.text} <small>${c.timestamp?.toDate().toLocaleString() || ''}</small></p>`).join('')}
        </div>
      </div>
    `;

    postsContainer.appendChild(postDiv);
  });

  // Add event listeners for Like buttons
  document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const postId = button.getAttribute('data-id');
      const postRef = doc(db, "posts", postId);
      const currentLikes = parseInt(button.textContent.match(/\d+/)[0]) || 0;

      await updateDoc(postRef, { likes: currentLikes + 1 });
      loadPosts();
    });
  });

  // Add event listeners for Comment buttons
  document.querySelectorAll('.comment-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const postId = button.getAttribute('data-id');
      const input = button.parentElement.querySelector('.comment-input');
      const text = input.value.trim();
      if (!text) return;

      const postRef = doc(db, "posts", postId);
      const docSnap = await getDocs(query(collection(db, "posts")));
      const postDoc = docSnap.docs.find(d => d.id === postId);
      const currentComments = postDoc.data().comments || [];

      const newComment = {
        text,
        timestamp: Timestamp.now()
      };

      await updateDoc(postRef, {
        comments: [...currentComments, newComment]
      });

      input.value = "";
      loadPosts();
    });
  });

  // Share button logic
  document.querySelectorAll('.share-btn').forEach(button => {
    button.addEventListener('click', () => {
      const text = button.getAttribute('data-text');
      const shareData = {
        title: "EANO Community Post",
        text,
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(console.error);
      } else {
        alert("Sharing not supported on this device.");
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", loadPosts);
