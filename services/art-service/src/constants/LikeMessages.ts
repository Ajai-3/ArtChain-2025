export enum LIKE_MESSAGES {
  LIKE_SUCCESS = "Post liked successfully",
  UNLIKE_SUCCESS = "Post unliked successfully",
  FETCH_SUCCESS = "Likes fetched successfully",
  ALREADY_LIKED = "Already liked this post",
  MISSING_USER_ID = "Missing x-user-id header",
  CANNOT_UNLIKE_THE_POST = "Cannot unlike a post that is not liked.",
}
