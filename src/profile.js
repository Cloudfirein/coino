class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Profile button
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.openProfileModal();
            });
        }

        // Close profile modal
        const closeProfileBtn = document.getElementById('close-profile');
        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => {
                this.closeProfileModal();
            });
        }

        // Change avatar button
        const changeAvatarBtn = document.getElementById('change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                document.getElementById('avatar-input').click();
            });
        }

        // Avatar input change
        const avatarInput = document.getElementById('avatar-input');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                this.handleAvatarChange(e);
            });
        }

        // Save profile button
        const saveProfileBtn = document.getElementById('save-profile-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.saveProfile();
            });
        }
    }

    async openProfileModal() {
        this.currentUser = window.authManager.getCurrentUser();
        if (!this.currentUser) return;

        try {
            this.userData = await window.authManager.getUserData();
            if (this.userData) {
                this.populateProfileData();
                document.getElementById('profile-modal').classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error opening profile modal:', error);
            window.authManager.showToast('Error loading profile', 'error');
        }
    }

    closeProfileModal() {
        document.getElementById('profile-modal').classList.add('hidden');
    }

    populateProfileData() {
        if (!this.userData) return;

        // Basic info
        const profileName = document.getElementById('profile-name');
        const profileUsername = document.getElementById('profile-username');
        const profileEmail = document.getElementById('profile-email');
        const profileAvatar = document.getElementById('profile-avatar');

        if (profileName) profileName.value = this.userData.displayName || '';
        if (profileUsername) profileUsername.value = this.userData.username || '';
        if (profileEmail) profileEmail.value = this.userData.email || '';
        if (profileAvatar && this.userData.avatar) {
            profileAvatar.src = this.userData.avatar;
        }

        // Stats
        const profileCoins = document.getElementById('profile-coins');
        const profileWins = document.getElementById('profile-wins');
        const profileLosses = document.getElementById('profile-losses');
        const profileWinrate = document.getElementById('profile-winrate');

        if (profileCoins) {
            profileCoins.textContent = this.userData.isAdmin ? '∞' : this.userData.coins.toLocaleString();
        }
        if (profileWins) profileWins.textContent = this.userData.totalWins || 0;
        if (profileLosses) profileLosses.textContent = this.userData.totalLosses || 0;
        if (profileWinrate) profileWinrate.textContent = `${this.userData.winRate || 0}%`;
    }

    async handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            window.authManager.showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            window.authManager.showToast('Image size must be less than 5MB', 'error');
            return;
        }

        try {
            // Show loading state
            const changeAvatarBtn = document.getElementById('change-avatar-btn');
            if (changeAvatarBtn) {
                changeAvatarBtn.innerHTML = '<span class="material-icons">hourglass_empty</span>';
                changeAvatarBtn.disabled = true;
            }

            // Upload to Firebase Storage
            const storageRef = storage.ref(`avatars/${this.currentUser.uid}/${Date.now()}_${file.name}`);
            const uploadTask = storageRef.put(file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Progress tracking if needed
                },
                (error) => {
                    console.error('Upload error:', error);
                    window.authManager.showToast('Error uploading image', 'error');
                },
                async () => {
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        
                        // Update profile avatar preview
                        const profileAvatar = document.getElementById('profile-avatar');
                        if (profileAvatar) {
                            profileAvatar.src = downloadURL;
                        }

                        // Store URL temporarily (will be saved when user clicks save)
                        this.tempAvatarUrl = downloadURL;
                        
                        window.authManager.showToast('Image uploaded successfully', 'success');
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        window.authManager.showToast('Error processing image', 'error');
                    }
                }
            );
        } catch (error) {
            console.error('Error uploading avatar:', error);
            window.authManager.showToast('Error uploading image', 'error');
        } finally {
            // Reset button
            const changeAvatarBtn = document.getElementById('change-avatar-btn');
            if (changeAvatarBtn) {
                changeAvatarBtn.innerHTML = '<span class="material-icons">camera_alt</span>';
                changeAvatarBtn.disabled = false;
            }
        }
    }

    async saveProfile() {
        if (!this.currentUser || !this.userData) return;

        const profileName = document.getElementById('profile-name');
        const profileUsername = document.getElementById('profile-username');

        if (!profileName || !profileUsername) return;

        const newName = profileName.value.trim();
        const newUsername = profileUsername.value.trim().toLowerCase();

        if (!newName || !newUsername) {
            window.authManager.showToast('Name and username are required', 'error');
            return;
        }

        if (newUsername.length < 3) {
            window.authManager.showToast('Username must be at least 3 characters', 'error');
            return;
        }

        try {
            // Show loading state
            const saveBtn = document.getElementById('save-profile-btn');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Saving...';
            }

            // Check if username is taken (if changed)
            if (newUsername !== this.userData.username) {
                const usernameCheck = await db.collection('users')
                    .where('username', '==', newUsername)
                    .get();
                    
                if (!usernameCheck.empty) {
                    window.authManager.showToast('Username is already taken', 'error');
                    return;
                }
            }

            // Prepare update data
            const updateData = {
                displayName: newName,
                username: newUsername
            };

            // Add avatar URL if changed
            if (this.tempAvatarUrl) {
                updateData.avatar = this.tempAvatarUrl;
            }

            // Update Firestore
            await db.collection('users').doc(this.currentUser.uid).update(updateData);

            // Update Firebase Auth profile
            await this.currentUser.updateProfile({
                displayName: newName
            });

            // Update header UI
            if (window.gameManager) {
                await window.gameManager.loadUserData();
            }

            // Update local userData
            this.userData = { ...this.userData, ...updateData };

            // Clear temp avatar URL
            this.tempAvatarUrl = null;

            window.authManager.showToast('Profile updated successfully', 'success');
            this.closeProfileModal();
        } catch (error) {
            console.error('Error saving profile:', error);
            window.authManager.showToast('Error saving profile', 'error');
        } finally {
            // Reset button
            const saveBtn = document.getElementById('save-profile-btn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<span class="material-icons">save</span> Save Changes';
            }
        }
    }
}

// Initialize profile manager
window.profileManager = new ProfileManager();