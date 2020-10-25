import React,{useEffect,Fragment} from 'react'
import{Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getCurrentProfile,deleteAccount} from '../../actions/profile'
import Spinner from '../layout/spinner'
import Dashboardactions from './Dashboardactions'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({getCurrentProfile,deleteAccount,profile:{profile,loadinng},auth:{user}}) => {
    useEffect(()=>{getCurrentProfile();},[getCurrentProfile])
    return loadinng && profile===null? <Spinner /> :
    <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className ="lead">
            <i className =" fas fa-user"></i>Welcome {user && user.name}
        </p>
        {profile!==null? 
        <Fragment>
            <Dashboardactions />
            <Experience experience={profile.experience} />
            <Education education={profile.education}/>
            <div className="my-2">
                <button className='btn btn-danger' onClick={()=>deleteAccount()}>
        <i className='fas fa-user-minus'></i>{' '}Delete Account</button>
            </div>
        </Fragment>:
        <Fragment>
            <p>You don't have a profile for this account, Please add some info</p>
            <Link to="/create_profile" className ="btn btn-primary my-1">Create Profile</Link>
        </Fragment> }
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile:PropTypes.func.isRequired,
    deleteAccount:PropTypes.func.isRequired,
    auth:PropTypes.object.isRequired,
    profile:PropTypes.object.isRequired,
}

const mapStateToProps =state =>({
    auth:state.auth,
    profile:state.profile
})

export default connect(mapStateToProps,{getCurrentProfile,deleteAccount})(Dashboard)
