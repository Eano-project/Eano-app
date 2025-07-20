<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="theme-color" content="#0a0a0a" />
  <meta name="description" content="EANO – Decentralized mining & referral-based crypto platform." />
  <meta name="keywords" content="EANO, crypto, mining, Pi Network alternative, blockchain, referral earning" />
  <meta name="author" content="Santorum Chukwuneke" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:title" content="EANO – Crypto Mining Simplified" />
  <meta property="og:description" content="Mine and earn with friends using EANO's referral-based crypto ecosystem." />
  <meta property="og:image" content="https://yourdomain.netlify.app/assets/eano-logo.png" />
  <meta property="og:url" content="https://yourdomain.netlify.app" />
  <meta property="og:type" content="website" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="EANO – Crypto Mining Simplified" />
  <meta name="twitter:description" content="Earn crypto with ease. Mine with referrals in the EANO ecosystem." />
  <meta name="twitter:image" content="https://yourdomain.netlify.app/assets/eano-logo.png" />

  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" href="/assets/favicon.ico" />
  <title>EANO – Sign In</title>
  <link rel="stylesheet" href="style.css" />
</head>

<body class="dark-mode">
  <div class="container">
    <img src="assets/eano-logo.png" alt="EANO Logo" class="logo" />

    <h1>Welcome to <span class="glow">EANO</span></h1>
    <p>Secure mining starts here.</p>

    <div class="login-buttons">
      <button onclick="signInWithGoogle()" class="google-btn">Sign in with Google</button>
      <button onclick="signInWithFacebook()" class="facebook-btn">Sign in with Facebook</button>
    </div>
  </div>

  <!-- ✅ Inject Firebase Key from Netlify -->
  <script>
    window.FIREBASE_API_KEY = "{{FIREBASE_API_KEY}}"; // Netlify ENV will replace this
  </script>

  <!-- ✅ Firebase Login Handler (Modular) -->
  <script type="module">
    import {
      signInWithGoogle,
      signInWithFacebook,
    } from './firebase.js';

    window.signInWithGoogle = signInWithGoogle;
    window.signInWithFacebook = signInWithFacebook;
  </script>

  <!-- ✅ Optional: Register PWA Service Worker -->
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log("✅ Service Worker Registered"))
        .catch(err => console.error("❌ SW Error:", err));
    }
  </script>
</body>
</html>
