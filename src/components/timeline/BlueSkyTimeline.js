import "bsky-embed/dist/bsky-embed.es.js"

const BlueSkyTimeline = () => {

  return (
    <div>
      <bsky-embed
          username="glygen.bsky.social"
          feed="at://did:plc:dmiyosipmoozjclj27ntycyj/app.bsky.feed.generator/"
          limit="10"
          link-target="_blank"
          link-image="true"
          custom-styles=".w-14 { width: 24px !important; } .h-14 { height: 24px !important; } .gap-2 { gap: 10px !important; display: inline !important; }"
        >
      </bsky-embed>
      <div className="bsky-footer"><a href="https://bsky.app/profile/glygen.bsky.social" className="btn" target="_blank" rel="nofollow noopener noreferrer">See more posts on Bluesky</a></div>
    </div>
  );
};

export default BlueSkyTimeline;