import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/spinner'
import {getpost} from '../../actions/post'
import PostItem from '../posts/PostItem'
import {Link} from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({getpost,post:{post,loading},match}) => {
    useEffect(()=>{
        getpost(match.params.id)
    },[getpost,match.params.id])

    return loading || post === null? <Spinner />:
    <Fragment>
        <Link to='/posts'className='btn'>Back To Posts</Link>
        <PostItem post = {post} showActions={false} />
        <CommentForm postId = {post._id} />
        <div className ='comments'>
            {post.comments.map(comment=>(
                <CommentItem key={comment._id} comment={comment} postId={post._id} />
            ))}
        </div>
    </Fragment>
}

Post.propTypes = {
    getpost:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired,
}

const mapstateToProps =state => ({
    post:state.post
})

export default connect(mapstateToProps,{getpost})(Post)
