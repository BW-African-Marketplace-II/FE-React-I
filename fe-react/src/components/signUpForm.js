import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { axiosWithAuth } from '../utils/axiosWithAuth'
import { register } from '../store/actions'
import { connect } from 'react-redux'
import Anime, {anime} from 'react-anime';
import { ToastsContainer, ToastsStore } from 'react-toasts';


const MainDiv = styled.div`
    padding-top: 1%;
    padding-bottom: 1%;
    margin-top: 5%;
    margin-left: 30%;
    margin-right: 30%;
    margin-bottom: 5%;
    background: #EA8547;
    border-radius: 30px;
    box-shadow: 0 5px 20px rgba(131, 131, 131, 1);
`

const FormDiv = styled.div`
    width: 90%;
    max-width: 340px;
    margin: 10vh auto;
`

const Header = styled.h1`
    color: #342F2C;
    margin-bottom: 3%;
    text-align: center;
`

const FormInputs = styled.p`
    font-size: $font-size;
    margin-bottom: -10px;
    font-weight: 500;
    color: white;
`

const Inputs = styled.input`
    display: block;
    width: 100%;
    padding: 20px;
    margin-top: 10%;
    font-family: $font-family;
    -webkit-appearance: none;
    border: 0;
    outline: 0;
    transition: 0.3s;
`

const Errors = styled.p`
    color: black;
    font-weight: bold;
    margin-top: 2%;
`

const Checkbox = styled.p`
text-align: center;
    margin-top: 5%;
    margin-bottom: 20%;
`

const Submit = styled.button`
    display: block;
    width: 100%;
    padding: 20px;
    outline: 0;
    border: 0;
    color: white;
    margin-top: 5%;
    background: #342F2C;
    &: hover {
        box-shadow: 0 0 5px #ffffff,
                    0 0 5px #ffffff,
                    0 0 15px #ffffff,
                    0 0 25px #ffffff;

                   
    } 
`

// Validation Using Yup

const formSchema = yup.object().shape({
    username: yup
        .string()
        .required("Name is a required field"),
    email: yup
        .string()
        .email("Must be a valid email address")
        .required("Email is a required field"),
    location: yup
        .string()
        .required("Location is a required field"),
    password: yup
        .string()
        .min(5, "Password must be at least 5 characters")
        .required("Must include a password"),
   
})


// Form Function

function SignUpForm(props) {
    const history = useHistory()
    const [userList, setUserList] = useState([]);

    const [formState, setFormState] = useState({
        username: "",
        email: "",
        location: "",
        password: "",
       
    });

const [buttonDisabled, setButtonDisabled] = useState(true);

useEffect(() => {
    formSchema.isValid(formState).then(valid => {
        setButtonDisabled(!valid);
    });
}, [formState]);

const [errorState, setErrorState] = useState({
    username: "",
    email: "",
    location: "",
    password: "",
    
});

const validate = e => {
    let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
    yup
      .reach(formSchema, e.target.name)
      .validate(value)
      .then(valid => {
          setErrorState({
              ...errorState,
              [e.target.name]: ""
          })
      })
      .catch(err => {
          setErrorState({
              ...errorState,
              [e.target.name]: err.errors[0]
          });
      });
};

// onChange function

const inputChange = e => {
    e.persist();
    validate(e);
    let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({...formState, [e.target.name]: value});
};

const formSubmit = e => {
    e.preventDefault();
    console.log('submitted')
    props.register(formState)
    .then(res => {
        history.push('/protected')
    })
    
};


return (
    <MainDiv>
       
    <form onSubmit={formSubmit}>
    <FormDiv>
    <Header>
            Create an Account
    </Header>
        <FormInputs>

        <label htmlFor="username">
            
            <Inputs
                type="text"
                placeholder="name"
                name="username"
                id="username"
                value={formState.username}
                onChange={inputChange}
                />
                {errorState.username.length > 0 ? (
                    <Errors className="error">{errorState.username}</Errors>
                ) : null}
        </label>
        </FormInputs>
        <FormInputs>
        <label htmlFor="email">
            <Inputs
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                value={formState.email}
                onChange={inputChange}
                />
                {errorState.email.length > 0 ? (
                    <Errors className="error">{errorState.email}</Errors>
                ) : null}
        </label>
        </FormInputs>
        <FormInputs>
        <label htmlFor="location">
            <Inputs
                type="text"
                placeholder="Location"
                name="location"
                id="location"
                value={formState.location}
                onChange={inputChange}
                />
                {errorState.location.length > 0 ? (
                    <Errors className="error">{errorState.location}</Errors>
                ) : null}
        </label>
        </FormInputs>
        <FormInputs>
        <label htmlFor="password">
            <Inputs
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                value={formState.password}
                onChange={inputChange}
            />
            {errorState.password.length < 0 ? (
                    <Errors className="error">{errorState.password}</Errors>
                ) : null}
        </label>
        </FormInputs>
            <div className="button-div">


        <Submit disabled={buttonDisabled} onClick={() => ToastsStore.info(`Welcome ${formState.username}`)}>Submit</Submit>
        <ToastsContainer store={ToastsStore}/>
        <Submit onClick={() => history.push("/signIn")} >Already have an account?</Submit>


        </div>
       
    </FormDiv>
    </form>
    
    </MainDiv>
);

};

const mapStateToProps = (state) => {
    return {
        data: state.LoginReducer.data
    }
}

export default connect(mapStateToProps, { register })(SignUpForm);
