// profile.js
import { auth, onAuthStateChanged } from './auth.js';
import { db, doc, getDoc, updateDoc } from './firebase.js';
import { redeemTrustScoreToEANO } from './redeem.js';

// Debug: Confirm imports
console.log('profile.js loaded with auth:', auth);

// Load user data on auth state change
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  window.currentUser = user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    document.getElementById('username').value = data.username || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('miningLevel').textContent = data.miningLevel || '🐥 Chicken';
    document.getElementById('trustScore').textContent = data.trustScore || 0;
    document.getElementById('balance').textContent = `${data.balance || 0}.000 EANO`;
    document.getElementById('refLink').value = `https://eano-app.netlify.app/?ref=${user.uid}`;
    new QRious({
      element: document.getElementById('qrCode'),
      value: `https://eano-app.netlify.app/?ref=${user.uid}`,
      size: 180,
    });
  }
});

// Avatar Selection
window.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('avatar-gallery');
  const preview = document.getElementById('avatarPreview');

  for (let i = 1; i <= 10; i++) {
    const avatar = document.createElement('img');
    avatar.src = `/assets/avatars/avatar${i}.png`;
    avatar.className = 'avatar-img';
    avatar.alt = `Avatar ${i}`;
    avatar.onclick = () => {
      preview.src = avatar.src;
      if (auth.currentUser) {
        updateDoc(doc(db, 'users', auth.currentUser.uid), { avatar: `avatar${i}.png` });
      }
    };
    gallery.appendChild(avatar);
  }
});

// Save Phone and Name Changes
document.getElementById('nameSaveBtn')?.addEventListener('click', async () => {
  if (auth.currentUser) {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      phone: document.getElementById('phone').value
    });
    alert('Changes saved!');
  }
});

// Copy Referral Code
function copyReferral() {
  const refLink = document.getElementById('refLink');
  refLink.select();
  document.execCommand('copy');
  alert('Referral link copied!');
}

// Social Media Sharing
window.addEventListener('DOMContentLoaded', () => {
  const shareButtons = document.getElementById('shareButtons');
  if (auth.currentUser) {
    const refLink = `https://eano-app.netlify.app/?ref=${auth.currentUser.uid}`;
    const socialLinks = {
      whatsapp: `https://wa.me/?text=Join EANO: ${refLink}`,
      telegram: `https://t.me/share/url?url=${refLink}&text=Join EANO!`,
      discord: `https://discord.com/channels/@me?message=Join EANO: ${refLink}`,
      snapchat: `https://www.snapchat.com/scan?attachmentUrl=${refLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${refLink}`
    };

    Object.entries(socialLinks).forEach(([platform, url]) => {
      const button = document.createElement('a');
      button.href = url;
      button.target = '_blank';
      button.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
      button.className = 'btn';
      shareButtons.appendChild(button);
    });
  }
});

// Redeem TrustScore
document.getElementById('redeemBtn')?.addEventListener('click', () => {
  if (auth.currentUser) {
    redeemTrustScoreToEANO(auth.currentUser.uid);
  }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Logout error:', error);
  });
});

// Persist scroll position
window.addEventListener('beforeunload', () => {
  localStorage.setItem('profileScroll', window.scrollY);
});
window.addEventListener('load', () => {
  const scrollPos = localStorage.getItem('profileScroll');
  if (scrollPos) window.scrollTo(0, parseInt(scrollPos));
});
