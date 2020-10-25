import axios from 'axios'
import setAlert from './alert'
import {GET_PROFILE,PORFILE_ERROR,UPDATE_PROFILE,CLEAR_PROFILE,ACCOUNT_DELETED,GET_PROFILES,GET_GITREPOS} from './types'

//get current user profile
export const getCurrentProfile =()=>async dispatch=>
{
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (error) {
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//get all profiles
export const getProfiles =()=>async dispatch=>
{
    dispatch({type:CLEAR_PROFILE})
    try {
        const res = await axios.get('/api/profile');
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        });
    } catch (error) {
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//get profile by ID
export const getProfileById =userId=>async dispatch=>
{
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    } catch (error) {
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//getGithub repos
export const getGithubRepos =username=>async dispatch=>
{
    try {
        const res = await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type:GET_GITREPOS,
            payload:res.data
        });
    } catch (error) {
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Create or update profile
export const createProfile=(formData,history,edit = false)=>async dispatch =>
{
    try {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          
    const res= await axios.post('/api/profile', formData,config)
    dispatch({
        type:GET_PROFILE,
        payload:res.data
    });

    dispatch(setAlert(edit? 'Profile Update':'Profile created','success'))
    if(!edit)
    {
        history.push('/dashboard')
    }
    } catch (error) {
        const errors = error.response.data.errors;
     if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Add Experience
export const addExperience=(formData,history)=>async dispatch=>
{
    try {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          
    const res= await axios.put('/api/profile/experience', formData,config)
    dispatch({
        type:UPDATE_PROFILE,
        payload:res.data
    });

    dispatch(setAlert('Experience added','success'))

    history.push('/dashboard')

    } catch (error) {
        const errors = error.response.data.errors;
     if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Add Education
export const addEducation=(formData,history)=>async dispatch=>
{
    try {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          
    const res= await axios.put('/api/profile/education', formData,config)
    dispatch({
        type:UPDATE_PROFILE,
        payload:res.data
    });

    dispatch(setAlert('Education added','success'))

    history.push('/dashboard')

    } catch (error) {
        const errors = error.response.data.errors;
     if (errors) {
      errors.forEach((element) => dispatch(setAlert(element.msg, 'danger')));
    }
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Delete Experience
export const deleteExperience = id => async dispatch =>
{
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`)
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Experience removed','success'))
    } catch (error) {
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Delete Experience
export const deleteEducation = id => async dispatch =>
{
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        });
        dispatch(setAlert('Education removed','success'))
    } catch (error) {
        dispatch({
            type:PORFILE_ERROR,
            payload:{msg:error.response.statusText, status:error.response.status}
        });
    }
}

//Delete Account
export const deleteAccount = () => async dispatch =>
{
    if(window.confirm('Are you sure?Account will be deleted permenantly'))
    {
        try {
            await axios.delete('/api/profile')
            dispatch({type:CLEAR_PROFILE});
            dispatch({type:ACCOUNT_DELETED});
            dispatch(setAlert('Your account has been deleted','success'))
        } catch (error) {
            dispatch({
                type:PORFILE_ERROR,
                payload:{msg:error.response.statusText, status:error.response.status}
            });
        }
    }
}