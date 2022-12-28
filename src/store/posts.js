import axios from "axios";

const posts = (state = [], action) => {
    if (action.type === "GET_POSTS") {
        return action.posts;
    }
    if (action.type === "CREATE_POST") {
		return [...state, action.post];
	}
    return state
}

export const fetchPosts = () => {
    return async (dispatch) => {
      const response = await axios.get("/api/posts");
      dispatch({ type: "GET_POSTS", posts: response.data });
    };
  };

export const createPost = (post) => {
	return async (dispatch) => {
		const response = await axios.post("/api/posts", post);
		dispatch({ type: "CREATE_POST", post: response.data });
	};
};

export default posts;