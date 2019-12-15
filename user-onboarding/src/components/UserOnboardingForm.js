import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserOnboardingForm = ({ values, errors, touched, status }) => {
    // console.log("Values: ", values);
    // console.log("Errors: ", errors);
    // console.log("Touched: ", touched);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("status has changed: ", status);
        status && setUsers(user => [...users, status]);
    }, [status]);

    return (
        <div className='user-onboarding-form'>
            <h2>Create an account</h2>
            <Form>
                <Field type="text" name="name" placeholder="Name" />
                {touched.name && errors.name && (
                    <p className="errors">{errors.name}</p>
                )}
                <Field type="email" name="email" placeholder="Email" />
                {touched.email && errors.email && (
                    <p className="errors">{errors.email}</p>
                )}
                <Field type="password" name="password" placeholder="Password" />
                {touched.password && errors.password && (
                    <p className="errors">{errors.password}</p>
                )}
                <div className='checkbox-container'>
                    <label htmlFor="tos" className="checkbox-label">Terms of Service</label>
                    <Field type="checkbox" name="tos" checked={values.tos} />
                    {touched.tos && errors.tos && (
                        <p className="errors">{errors.tos}</p>
                    )}
                </div>
                <button type="submit">Submit</button>
            </Form>
            {users.map(user => {
                return (
                <ul key={user.id}>
                    <li>Username: {user.name}</li>
                    <li>Email: {user.email}</li>
                </ul>
                );
            })}
        </div>
    )
}

const FormikUserOnboardingForm = withFormik({
    mapPropsToValues(props) {
        return {
            name: props.name || "",
            email: props.email || "",
            password: props.password || "",
            tos: props.tos || false,
        }
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string()
            .min(6, 'Password must be longer than 6 characters.')
            .max(18, 'Password must be 18 characters or less.')
            .required(),
        tos: Yup.bool()
            .test(
                'consent',
                'Please accept our Terms of Service',
                value => value === true
            )
          .required("Please accept our Terms of Service"),
    }),
    handleSubmit(values, { setStatus, resetForm }) {
        axios
            .post("https://reqres.in/api/users/", values)
            .then(res => {
            console.log("success", res);
            setStatus(res.data);
            resetForm();
            })
            .catch(err => console.log(err.response));
    }
})(UserOnboardingForm);

export default FormikUserOnboardingForm;