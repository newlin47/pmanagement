import axios from "axios";

const comments = (state = [], action) => {
	if (action.type === "GET_COMMENTS") {
		return action.comments;
	}
	if (action.type === "CREATE_COMMENT") {
		return [...state, action.comment];
	}
	if (action.type === "DELETE_COMMENT") {
		return state.filter(comment => comment.id !== action.commentId)
	}
	return state;
};

export const fetchComments = () => {
    return async (dispatch) => {
      const response = await axios.get("/api/comments");
      dispatch({ type: "GET_COMMENTS", comments: response.data });
    };
  };

  export const createComment = (newComment) => {
	return async (dispatch) => {
		const response = await axios.post("/api/comments/:id", newComment);
		dispatch({ type: "CREATE_COMMENT", comment: response.data });
	};
};

  export const deleteComment = (comment) => {
    return async(dispatch)=> {
        await axios.delete(`/api/comments/${comment.id}`);
        dispatch({type: 'DELETE_COMMENT', commentId: comment.id});
    }
  }

export default comments;