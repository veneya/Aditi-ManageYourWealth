const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyCuu-3MMOmo9o9fDh3i8s8QR6FL1WFY9x8',
  authDomain: 'aditi-49e87.firebaseapp.com',
  projectId: 'aditi-49e87',
  appId: '1:664441877943:web:36079862864a3810e42432',
};

const load = (src) => new Promise((resolve, reject) => {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return existing.addEventListener('load', resolve, { once: true });
  const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
});

export async function signInWithGoogle() {
  if (!window.firebase) {
    await load('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
    await load('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth-compat.js');
  }
  if (!window.firebase.apps.length) window.firebase.initializeApp(config);
  return window.firebase.auth().signInWithPopup(new window.firebase.auth.GoogleAuthProvider());
}
