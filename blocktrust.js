// ============================================================
// BLOCKTRUST – COMPLETE FRONTEND SCRIPT
// ============================================================
// ============================================================
// FREE SPEECH COLLAPSIBLE
// ============================================================
const toggle = document.getElementById('freeSpeechToggle');
const content = document.getElementById('freeSpeechContent');
const arrow = document.getElementById('freeSpeechArrow');

if (localStorage.getItem('freeSpeechOpen') === 'true') {
    content.classList.add('open');
    arrow.classList.add('open');
}

if (toggle) {
    toggle.addEventListener('click', function() {
        content.classList.toggle('open');
        arrow.classList.toggle('open');
        localStorage.setItem('freeSpeechOpen', content.classList.contains('open'));
    });
}

// ============================================================
// TAB SWITCHING (Home / Premium)
// ============================================================
const tabs = {
    home: document.getElementById('homeTab'),
    premium: document.getElementById('premiumTab')
};

const navLinks = document.querySelectorAll('.bottom-nav a[data-tab]');

function switchTab(tabId) {
    Object.values(tabs).forEach(tab => {
        if (tab) tab.classList.remove('active');
    });
    if (tabs[tabId]) tabs[tabId].classList.add('active');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.tab === tabId) {
            link.classList.add('active');
        }
    });
    const categoryBar = document.querySelector('.category-bar');
    if (categoryBar) {
        if (tabId === 'premium') {
            categoryBar.style.display = 'none';
        } else {
            categoryBar.style.display = 'block';
        }
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.dataset.tab;
        if (tabId === 'post') return;
        if (tabId === 'alerts' || tabId === 'profile') {
            alert('📌 ' + tabId.charAt(0).toUpperCase() + tabId.slice(1) + ' section coming soon.');
            return;
        }
        switchTab(tabId);
    });
});

// ============================================================
// CATEGORY FILTER
// ============================================================
const pills = document.querySelectorAll('.pill');
const posts = document.querySelectorAll('.post-card');

pills.forEach(pill => {
    pill.addEventListener('click', function() {
        pills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        const category = this.dataset.category;

        posts.forEach(post => {
            const postCategories = post.dataset.category.split(' ');
            if (category === 'all' || postCategories.includes(category)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    });
});

// ============================================================
// SEARCH
// ============================================================
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        posts.forEach(post => {
            const text = post.textContent.toLowerCase();
            if (query === '' || text.includes(query)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });

        if (query.length > 0) {
            pills.forEach(p => p.classList.remove('active'));
            const allPill = document.querySelector('.pill[data-category="all"]');
            if (allPill) allPill.classList.add('active');
        }
    });
}

// ============================================================
// POST MODAL
// ============================================================
const modal = document.getElementById('postModal');
const openModalBtn = document.getElementById('openPostModal');
const closeModalBtn = document.getElementById('closePostModal');
const submitPostBtn = document.getElementById('submitPost');
const submitPostFree = document.getElementById('submitPostFree');
const postContent = document.getElementById('postContent');
const boostCheck = document.getElementById('boostPost');
const rewardInput = document.getElementById('rewardAmount');

function openModal() {
    if (modal) {
        modal.classList.add('active');
        if (postContent) {
            postContent.value = '';
            postContent.focus();
        }
        if (boostCheck) boostCheck.checked = false;
        if (rewardInput) rewardInput.value = '';
    }
}

if (openModalBtn) {
    openModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        if (modal) modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            modal.classList.remove('active');
        }
    });
}

function createPost(isBoosted, reward) {
    if (!postContent) return false;
    const content = postContent.value.trim();
    if (content === '') {
        alert('Please write something before posting.');
        return false;
    }

    const feed = document.getElementById('feedContainer');
    if (!feed) return false;

    const newPost = document.createElement('div');
    newPost.className = 'post-card' + (isBoosted ? ' boosted' : '');
    newPost.setAttribute('data-category', 'all');
    newPost.innerHTML = `
        <div class="post-header">
            <div class="post-avatar" style="background:linear-gradient(135deg,#2e7d32,#43a047);">BT</div>
            <div>
                <div class="post-user">You ${isBoosted ? '<span class="badge badge-boosted"><i class="fas fa-bolt"></i> Boosted</span>' : ''}</div>
                <div class="post-neighborhood">📍 Your Neighborhood • just now</div>
            </div>
            <span class="post-time">Now</span>
        </div>
        <div class="post-content">${content.replace(/\n/g, '<br>')}</div>
        <div class="post-tags">
            <span class="post-tag location"><i class="fas fa-map-marker-alt"></i> Your Block</span>
            ${reward > 0 ? `<span class="post-tag reward"><i class="fas fa-dollar-sign"></i> $${reward} Reward</span>` : ''}
            ${isBoosted ? `<span class="post-tag boosted-tag"><i class="fas fa-bolt"></i> Boosted</span>` : ''}
        </div>
        <div class="post-actions">
            <button><i class="fas fa-heart"></i> 0</button>
            <button><i class="fas fa-comment"></i> 0</button>
            <button><i class="fas fa-share-alt"></i> 0</button>
            ${reward > 0 ? `<button class="claim-btn" onclick="alert('💰 Claim reward – $${reward}. Platform fee (10%) = $${Math.round(reward * 0.1)}. You receive $${Math.round(reward * 0.9)}.')"><i class="fas fa-hand-holding-usd"></i> Claim Reward</button>` : ''}
        </div>
    `;

    feed.insertBefore(newPost, feed.firstChild);
    if (modal) modal.classList.remove('active');
    if (postContent) postContent.value = '';
    if (boostCheck) boostCheck.checked = false;
    if (rewardInput) rewardInput.value = '';
    return true;
}

if (submitPostBtn) {
    submitPostBtn.addEventListener('click', function() {
        const reward = parseInt(rewardInput ? rewardInput.value : 0) || 0;
        const isBoosted = boostCheck ? boostCheck.checked : false;
        if (createPost(isBoosted, reward)) {
            const fee = Math.round(reward * 0.1);
            let msg = '✅ Post published!';
            if (isBoosted) msg += ' Boosted ($4.99).';
            if (reward > 0) msg += ' Reward: $' + reward + ' – platform fee: $' + fee + '.';
            alert(msg);
        }
    });
}

if (submitPostFree) {
    submitPostFree.addEventListener('click', function() {
        const reward = parseInt(rewardInput ? rewardInput.value : 0) || 0;
        const isBoosted = boostCheck ? boostCheck.checked : false;
        if (createPost(isBoosted, reward)) {
            const fee = Math.round(reward * 0.1);
            let msg = '✅ Post published!';
            if (isBoosted) msg += ' Boosted ($4.99).';
            if (reward > 0) msg += ' Reward: $' + reward + ' – platform fee: $' + fee + '.';
            alert(msg);
        }
    });
}

// ============================================================
// ESC TO CLOSE MODAL
// ============================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});

// ============================================================
// LIKE BUTTONS
// ============================================================
document.querySelectorAll('.like-btn, .post-actions button .fa-heart, .post-actions button .far.fa-heart').forEach(heart => {
    const btn = heart.closest('button');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        const countSpan = this.querySelector('.count');
        if (!icon) return;
        let count = parseInt(countSpan ? countSpan.textContent : 0) || 0;
        if (icon.classList.contains('fas')) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            count -= 1;
            this.classList.remove('liked');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            count += 1;
            this.classList.add('liked');
        }
        if (countSpan) countSpan.textContent = count;
    });
});

// ============================================================
// COMMENT BUTTON
// ============================================================
document.querySelectorAll('.comment-btn, .post-actions button .fa-comment, .post-actions button .far.fa-comment').forEach(comment => {
    const btn = comment.closest('button');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        alert('💬 Comment feature coming soon!');
    });
});

// ============================================================
// SHARE BUTTON
// ============================================================
document.querySelectorAll('.share-btn, .post-actions button .fa-share-alt').forEach(share => {
    const btn = share.closest('button');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const url = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('🔗 Link copied to clipboard! Share it with your neighbors.');
            }).catch(() => {
                alert('🔗 Share this post: ' + url);
            });
        } else {
            alert('🔗 Share this post: ' + url);
        }
    });
});

// ============================================================
// REPORT BUTTON
// ============================================================
document.querySelectorAll('.report-btn, .post-actions button .fa-flag').forEach(report => {
    const btn = report.closest('button');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        alert('🚩 Report submitted. We\'ll review this post.');
    });
});

// ============================================================
// PREMIUM SUBSCRIBE BUTTON
// ============================================================
document.querySelectorAll('.btn-premium').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('💳 Premium subscription – $9.99/month. Coming soon.');
    });
});

// ============================================================
// CLAIM REWARD
// ============================================================
document.querySelectorAll('.claim-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('💰 Claim reward flow coming soon.');
    });
});

// ============================================================
// CHARACTER COUNTER
// ============================================================
if (postContent) {
    const charCount = document.createElement('div');
    charCount.id = 'charCount';
    charCount.style.cssText = 'font-size:12px; color:var(--text-muted); margin-top:4px; text-align:right;';
    charCount.textContent = '0/500';
    postContent.parentNode.insertBefore(charCount, postContent.nextSibling);

    postContent.addEventListener('input', function() {
        const len = this.value.length;
        charCount.textContent = len + '/500';
        charCount.style.color = len > 500 ? 'var(--urgent)' : 'var(--text-muted)';
    });
}

// ============================================================
// LOADING INDICATOR
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const loading = document.querySelector('.loading-spinner');
    if (loading) loading.style.display = 'none';
});

// ============================================================
// CONSOLE READY
// ============================================================
console.log('🏡 BlockTrust loaded successfully.');
