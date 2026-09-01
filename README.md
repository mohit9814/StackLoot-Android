# 🤖 StackLoot Android App

> **"Lock allowance. Level up yield. Generational wealth habits in your pocket."**

Native Android application for **StackLoot** built with **Capacitor**, **React 19**, **Tailwind CSS**, and **TypeScript**.

---

## 📱 Mobile Architecture & Features

* **App ID:** `com.stackloot.app`
* **Target OS:** Android 8.0+ (API 26 to API 34/35)
* **Touch & Haptics:** Native tactile feedback on compounding sliders and milestone unlocks via `@capacitor/haptics`.
* **Local Notifications:** Automated monthly compounding dividend reminders via `@capacitor/local-notifications`.
* **Offline-First Persistence:** Native device storage using `@capacitor/preferences`.
* **Parent Security:** 4-digit PIN security lock modal for Parent Studio.
* **Bottom Navigation Bar:** Fast thumb-friendly switching between **Vault**, **Growth Lab**, **Goals**, and **Parent OS**.

---

## 🛠️ Developer Workflow & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Mobile Dev Server
```bash
npm run dev -- --host
```

### 3. Build & Sync Web Assets to Android
```bash
npm run cap:sync
```

### 4. Open in Android Studio
```bash
npm run cap:open
```
* In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build Bundle(s)** to generate the `.aab` file for Google Play Store upload.

---

## 📄 License
MIT License.
