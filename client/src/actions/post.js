import axios from 'axios'
import setAlert from './alert'
import {GET_POSTS,POST_ERROR,UPDATE_LIKES,DELETE_POST,ADD_POST,GET_POST,ADD_COMMENT,REMOVE_COMMENT} from './types'

//GET POSTS

export const getposts =() => async dispatch =>
{
    try {
        const res = await axios.get('/api/posts')
        
        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Add Like

export const addLike = id => async dispatch =>
{
    try {
        const res = await axios.put(`/api/posts/like/${id}`)
        
        dispatch({
            type:UPDATE_LIKES,
            payload:{ id, likes:res.data}
        })
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Remove Like

export const removeLike = id => async dispatch =>
{
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`)
        
        dispatch({
            type:UPDATE_LIKES,
            payload:{ id, likes:res.data}
        })
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Delete Post
export const deletePost = id => async dispatch =>
{
    try {
        await axios.delete(`/api/posts/${id}`)
        
        dispatch({
            type:DELETE_POST,
            payload: id
        })

        dispatch(setAlert('Post removed', 'success'))
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Add post

export const addPost = formData => async dispatch =>
{
    const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    try {
        const res = await axios.post('/api/posts',formData,config)
        
        dispatch({
            type:ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post added', 'success'))
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//GET POST

export const getpost =id => async dispatch =>
{
    try {
        const res = await axios.get(`/api/posts/${id}`)
        
        dispatch({
            type:GET_POST,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Add comment

export const addComment = (postId,formData) => async dispatch =>
{
    const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    try {
        const res = await axios.post(`/api/posts/comments/${postId}`,formData,config)
        
        dispatch({
            type:ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('comment added', 'success'))
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//delete comment

export const deleteComment = (postId,commentId) => async dispatch =>
{
    try {
         await axios.delete(`/api/posts/comments/${postId}/${commentId}`)
        dispatch({
            type:REMOVE_COMMENT,
            payload: commentId
        })

        dispatch(setAlert('comment removed', 'success'))
    } catch (error) {
        dispatch({
            type:POST_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}