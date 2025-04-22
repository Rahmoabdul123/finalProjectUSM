import Form from "../components/Form"
/**
*Code reused from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], [Tech with Tim], [https://www.youtube.com/watch?v=c-QsfbznSXI]
*  Accessed: [09/03/2025]
*/

function Register() {
    return <Form route="/api/user/register/" method="register" />
}

export default Register