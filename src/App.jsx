import React, { useMemo, useState } from "react";

const PLATFORMS = {
  x: {
    name: "X",
    characterLimit: 280,
    mediaLimit: 4,
    mediaTypes: ["image", "gif", "video"],
    hashtagLimit: 8,
    note: "Short-form updates with a strict character budget.",
  },
  instagram: {
    name: "Instagram",
    characterLimit: 2200,
    mediaLimit: 10,
    mediaTypes: ["image", "video"],
    hashtagLimit: 30,
    note: "Visual-first captions with a limited hashtag set.",
  },
  linkedin: {
    name: "LinkedIn",
    characterLimit: 3000,
    mediaLimit: 9,
    mediaTypes: ["image", "video"],
    hashtagLimit: 10,
    note: "Professional posts that favor focused hashtags.",
  },
  facebook: {
    name: "Facebook",
    characterLimit: 63206,
    mediaLimit: 10,
    mediaTypes: ["image", "gif", "video"],
    hashtagLimit: 20,
    note: "Flexible posts with generous text and media support.",
  },
  threads: {
    name: "Threads",
    characterLimit: 500,
    mediaLimit: 10,
    mediaTypes: ["image", "gif", "video"],
    hashtagLimit: 5,
    note: "Conversation-style posts with concise copy.",
  },
};

const TYPE_LABELS = {
  image: "images",
  video: "videos",
  gif: "GIFs",
};

function getMediaKind(file) {
  if (file.type.startsWith("image/gif")) return "gif";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "unknown";
}

function getHashtags(text) {
  return text.match(/#[\w]+/g) ?? [];
}

function buildValidation(text, mediaFiles, selectedPlatformIds) {
  const hashtags = getHashtags(text);
  const mediaKinds = mediaFiles.map(getMediaKind);

  return selectedPlatformIds.map((platformId) => {
    const platform = PLATFORMS[platformId];
    const messages = [];
    const remaining = platform.characterLimit - text.length;
    const usageRatio = text.length / platform.characterLimit;

    if (text.length > platform.characterLimit) {
      messages.push({
        type: "error",
        text: `${platform.name} is ${Math.abs(remaining)} characters over the limit.`,
      });
    } else if (usageRatio >= 0.9) {
      messages.push({
        type: "warning",
        text: `${platform.name} is close to its character limit.`,
      });
    }

    if (hashtags.length > platform.hashtagLimit) {
      messages.push({
        type: "error",
        text: `${platform.name} allows up to ${platform.hashtagLimit} hashtags.`,
      });
    }

    if (mediaFiles.length > platform.mediaLimit) {
      messages.push({
        type: "error",
        text: `${platform.name} allows up to ${platform.mediaLimit} media attachments.`,
      });
    }

    const unsupportedKinds = [...new Set(mediaKinds)].filter(
      (kind) => kind === "unknown" || !platform.mediaTypes.includes(kind),
    );

    if (unsupportedKinds.length > 0) {
      messages.push({
        type: "error",
        text: `${platform.name} does not support ${unsupportedKinds.join(", ")} attachments.`,
      });
    }

    if (text.trim().length === 0 && mediaFiles.length === 0) {
      messages.push({
        type: "warning",
        text: "Add text or media before scheduling this post.",
      });
    }

    return {
      platformId,
      platform,
      remaining,
      hashtags: hashtags.length,
      messages,
      isValid: !messages.some((message) => message.type === "error"),
    };
  });
}

function PlatformToggle({ id, selected, onChange }) {
  const platform = PLATFORMS[id];

  return (
    <label className={`platform-toggle ${selected ? "selected" : ""}`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onChange(id)}
      />
      <span>
        <strong>{platform.name}</strong>
        <small>{platform.characterLimit.toLocaleString()} chars</small>
      </span>
    </label>
  );
}

function MediaPanel({ files, onChange }) {
  return (
    <section className="panel media-panel" aria-labelledby="media-title">
      <div className="panel-heading">
        <h2 id="media-title">Media</h2>
        <span>{files.length} attached</span>
      </div>
      <label className="upload-zone">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(event) => onChange([...event.target.files])}
        />
        <span className="upload-icon">+</span>
        <span>Attach images, GIFs, or videos</span>
      </label>
      {files.length > 0 && (
        <ul className="media-list">
          {files.map((file) => (
            <li key={`${file.name}-${file.lastModified}`}>
              <span>{file.name}</span>
              <small>{getMediaKind(file)}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FeedbackPanel({ validations, selectedPlatformIds }) {
  if (selectedPlatformIds.length === 0) {
    return (
      <section className="panel empty-state">
        <h2>Select platforms</h2>
        <p>Choose one or more destinations to see real-time posting rules.</p>
      </section>
    );
  }

  return (
    <section className="panel feedback-panel" aria-labelledby="feedback-title">
      <div className="panel-heading">
        <h2 id="feedback-title">Validation</h2>
        <span>
          {validations.filter((item) => item.isValid).length}/{validations.length} ready
        </span>
      </div>
      <div className="validation-grid">
        {validations.map(({ platformId, platform, remaining, hashtags, messages, isValid }) => (
          <article className={`validation-card ${isValid ? "valid" : "invalid"}`} key={platformId}>
            <div className="validation-title">
              <strong>{platform.name}</strong>
              <span>{isValid ? "Ready" : "Needs edits"}</span>
            </div>
            <div className="meter" aria-label={`${platform.name} character usage`}>
              <span
                style={{
                  width: `${Math.min(
                    100,
                    ((platform.characterLimit - remaining) / platform.characterLimit) * 100,
                  )}%`,
                }}
              />
            </div>
            <div className="validation-stats">
              <span className={remaining < 0 ? "danger" : remaining < platform.characterLimit * 0.1 ? "warn" : ""}>
                {remaining.toLocaleString()} chars left
              </span>
              <span>
                {hashtags}/{platform.hashtagLimit} hashtags
              </span>
            </div>
            <p>{platform.note}</p>
            <ul className="messages">
              {messages.length === 0 ? (
                <li className="success">All selected rules pass.</li>
              ) : (
                messages.map((message) => (
                  <li className={message.type} key={message.text}>
                    {message.text}
                  </li>
                ))
              )}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState(["x", "instagram"]);

  const validations = useMemo(
    () => buildValidation(text, mediaFiles, selectedPlatformIds),
    [text, mediaFiles, selectedPlatformIds],
  );

  const hardestLimit = selectedPlatformIds.length
    ? Math.min(...selectedPlatformIds.map((id) => PLATFORMS[id].characterLimit))
    : 0;
  const remainingForTightest = hardestLimit - text.length;
  const hasErrors = validations.some((validation) => !validation.isValid);

  function togglePlatform(platformId) {
    setSelectedPlatformIds((current) =>
      current.includes(platformId)
        ? current.filter((id) => id !== platformId)
        : [...current, platformId],
    );
  }

  return (
    <main className="app-shell">
      <section className="composer">
        <div className="composer-header">
          <div>
            <p>Post Composer</p>
            <h1>Create once, validate everywhere.</h1>
          </div>
          <button disabled={selectedPlatformIds.length === 0 || hasErrors}>
            Schedule post
          </button>
        </div>

        <div className="workspace">
          <div className="compose-column">
            <section className="panel editor-panel" aria-labelledby="editor-title">
              <div className="panel-heading">
                <h2 id="editor-title">Content</h2>
                {selectedPlatformIds.length > 0 && (
                  <span className={remainingForTightest < 0 ? "danger" : remainingForTightest < hardestLimit * 0.1 ? "warn" : ""}>
                    {remainingForTightest.toLocaleString()} left on tightest platform
                  </span>
                )}
              </div>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Write your update, add hashtags, then choose where it should publish..."
              />
              <div className="editor-footer">
                <span>{text.length.toLocaleString()} characters</span>
                <span>{getHashtags(text).length} hashtags</span>
              </div>
            </section>

            <MediaPanel files={mediaFiles} onChange={setMediaFiles} />
          </div>

          <aside className="side-column">
            <section className="panel platform-panel" aria-labelledby="platform-title">
              <div className="panel-heading">
                <h2 id="platform-title">Platforms</h2>
                <span>{selectedPlatformIds.length} selected</span>
              </div>
              <div className="platform-list">
                {Object.keys(PLATFORMS).map((platformId) => (
                  <PlatformToggle
                    id={platformId}
                    key={platformId}
                    selected={selectedPlatformIds.includes(platformId)}
                    onChange={togglePlatform}
                  />
                ))}
              </div>
            </section>

            <section className="panel rule-panel" aria-labelledby="rules-title">
              <div className="panel-heading">
                <h2 id="rules-title">Rule summary</h2>
              </div>
              <ul>
                {selectedPlatformIds.map((id) => (
                  <li key={id}>
                    <strong>{PLATFORMS[id].name}</strong>
                    <span>
                      {PLATFORMS[id].mediaLimit} media, {PLATFORMS[id].mediaTypes.map((type) => TYPE_LABELS[type]).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <FeedbackPanel validations={validations} selectedPlatformIds={selectedPlatformIds} />
      </section>
    </main>
  );
}

export default App;
