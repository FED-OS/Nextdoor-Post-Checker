document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelect = document.getElementById('modelSelect');
  const postInput = document.getElementById('postInput');
  const charCount = document.getElementById('charCount');
  const checkBtn = document.getElementById('checkBtn');
  const checkBtnLabel = document.getElementById('checkBtnLabel');
  const btnSpinner = document.getElementById('btnSpinner');

  const emptyNote = document.getElementById('emptyNote');
  const thinkingNote = document.getElementById('thinkingNote');
  const report = document.getElementById('report');

  const stamp = document.getElementById('stamp');
  const categoryRow = document.getElementById('categoryRow');
  const categoryValue = document.getElementById('categoryValue');
  const reasonValue = document.getElementById('reasonValue');
  const fixRow = document.getElementById('fixRow');
  const fixValue = document.getElementById('fixValue');
  const copyBtn = document.getElementById('copyBtn');

  const SYSTEM_PROMPT = `You are an automated content moderation assistant for Nextdoor, a hyperlocal neighborhood platform. Evaluate the user's draft post against Nextdoor's community guidelines, watching in particular for:
- national politics or culture-war topics that aren't locally relevant
- public naming-and-shaming or personal attacks on named individuals
- discrimination or hate speech
- unverified local scams, MLM pitches, or predatory selling
- sale of unregulated goods (firearms, ammunition, alcohol, tobacco, prescription drugs)
- repetitive commercial spam

Respond ONLY with a JSON object in exactly this shape, no other text:
{
  "compliant": true or false,
  "category": "short name of the violated rule, or null if compliant",
  "reason": "two sentences max explaining the verdict",
  "suggested_fix": "a rewritten, compliant version that keeps the useful local intent, or null if compliant"
}`;

  const PRESETS = {
    offtopic: "This video is so interesting — Neil deGrasse Tyson roasts MAGA Ben Shapiro to his face on his own show. The younger generation has so much on their plate because this stuff wasn't even a topic when I was growing up. Wild how much the culture has changed.",
    shaming: "Watch out for that contractor John Smith who lives over on Oak Street! He took $500 of my money to fix my gutter and never finished the job. He's a total thief, do not hire him.",
    clean: "Found a golden retriever near the park entrance this morning. Blue collar, no tag. Sweet dog, resting safely in my backyard right now. Message me if he's yours!"
  };

  // Local fallback verdicts so the demo works with zero API key
  const SIMULATIONS = {
    offtopic: {
      compliant: false,
      category: "Off-topic / national politics",
      reason: "This centers on a national culture-war debate rather than anything happening in your neighborhood, and the phrasing around it is likely to get flagged by moderators.",
      suggested_fix: "Any other local parents feeling a bit of generational whiplash lately? I was watching a debate about how much more today's teens navigate compared to what we grew up with — curious how neighbors are handling these conversations at home."
    },
    shaming: {
      compliant: false,
      category: "Public naming & shaming",
      reason: "Calling out a specific person by name over a payment dispute is a personal attack, which Nextdoor removes to prevent public feuds.",
      suggested_fix: "Looking for recommendations: has anyone had a good (or bad) experience with gutter repair contractors in the area recently? Want to compare notes before I hire someone."
    },
    clean: {
      compliant: true,
      category: null,
      reason: "This is a straightforward local safety/lost-and-found post with no personal attacks, politics, or commercial content.",
      suggested_fix: null
    }
  };

  if (localStorage.getItem('nd_checker_key')) {
    apiKeyInput.value = localStorage.getItem('nd_checker_key');
  }

  postInput.addEventListener('input', () => {
    charCount.textContent = `${postInput.value.length} characters`;
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      postInput.value = PRESETS[key];
      postInput.dispatchEvent(new Event('input'));
      postInput.dataset.presetKey = key;
    });
  });

  postInput.addEventListener('input', () => {
    // typing manually invalidates the "this came from a preset" shortcut
    delete postInput.dataset.presetKey;
  });

  checkBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    const postText = postInput.value.trim();
    const model = modelSelect.value;

    if (!postText) {
      alert('Write (or pick) a post to check first.');
      return;
    }

    showThinking();

    // No key entered — use the local canned verdict for known presets,
    // or a generic keyword-based guess otherwise, so the demo still works.
    if (!apiKey) {
      setTimeout(() => {
        const presetKey = postInput.dataset.presetKey;
        if (presetKey && SIMULATIONS[presetKey]) {
          renderVerdict(SIMULATIONS[presetKey]);
        } else {
          renderVerdict(guessVerdict(postText));
        }
      }, 900);
      return;
    }

    localStorage.setItem('nd_checker_key', apiKey);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          response_format: { type: 'json_object' },
          temperature: 0.2,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: postText }
          ]
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error?.message || `Request failed (${response.status})`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content returned from the API.');

      const parsed = JSON.parse(content);
      renderVerdict(parsed);

    } catch (err) {
      console.error(err);
      alert(`Couldn't complete the check: ${err.message}`);
      showEmpty();
    }
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(fixValue.textContent).then(() => {
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    });
  });

  // Very rough offline heuristic — only used when there's no API key
  // and the text isn't one of the built-in presets.
  function guessVerdict(text) {
    const lower = text.toLowerCase();
    const shamingWords = ['thief', 'scammer', 'liar', 'stole', 'don\'t hire', 'do not hire'];
    const politicalWords = ['maga', 'trump', 'biden', 'democrat', 'republican', 'transgenderism', 'shapiro'];

    if (shamingWords.some(w => lower.includes(w))) {
      return {
        compliant: false,
        category: 'Possible public shaming',
        reason: 'This reads like it names and blames a specific person, which Nextdoor treats as a personal attack. (This is a rough offline guess — add an API key for a real read.)',
        suggested_fix: 'Describe the situation without naming the person, and ask neighbors for their own experiences instead.'
      };
    }
    if (politicalWords.some(w => lower.includes(w))) {
      return {
        compliant: false,
        category: 'Possible off-topic politics',
        reason: 'This looks like national political or culture-war content, which belongs in a Nextdoor Group, not the main feed. (This is a rough offline guess — add an API key for a real read.)',
        suggested_fix: 'Reframe around the local angle — how this affects your street, block, or neighbors directly.'
      };
    }
    return {
      compliant: true,
      category: null,
      reason: 'No obvious red flags in this offline guess, but this mode is not a substitute for a real check. Add an API key for an accurate read.',
      suggested_fix: null
    };
  }

  function showEmpty() {
    emptyNote.classList.remove('hidden');
    thinkingNote.classList.add('hidden');
    report.classList.add('hidden');
    checkBtn.disabled = false;
    checkBtnLabel.textContent = 'Check it';
    btnSpinner.classList.add('hidden');
  }

  function showThinking() {
    emptyNote.classList.add('hidden');
    thinkingNote.classList.remove('hidden');
    report.classList.add('hidden');
    checkBtn.disabled = true;
    checkBtnLabel.textContent = 'Checking';
    btnSpinner.classList.remove('hidden');
  }

  function renderVerdict(data) {
    emptyNote.classList.add('hidden');
    thinkingNote.classList.add('hidden');
    report.classList.remove('hidden');
    checkBtn.disabled = false;
    checkBtnLabel.textContent = 'Check it';
    btnSpinner.classList.add('hidden');

    // restart the stamp-down animation
    stamp.classList.remove('approved', 'violation');
    void stamp.offsetWidth; // reflow to reset animation
    stamp.style.animation = 'none';
    void stamp.offsetWidth;
    stamp.style.animation = '';

    reasonValue.textContent = data.reason || '';

    if (data.compliant) {
      stamp.textContent = 'APPROVED';
      stamp.classList.add('approved');
      categoryRow.classList.add('hidden');
      fixRow.classList.add('hidden');
    } else {
      stamp.textContent = 'FLAGGED';
      stamp.classList.add('violation');
      categoryRow.classList.remove('hidden');
      categoryValue.textContent = data.category || 'Policy concern';

      if (data.suggested_fix) {
        fixValue.textContent = data.suggested_fix;
        fixRow.classList.remove('hidden');
      } else {
        fixRow.classList.add('hidden');
      }
    }
  }
});
