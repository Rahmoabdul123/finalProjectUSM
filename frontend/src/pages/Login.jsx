import Form from "../components/Form"
/**
*Code reused from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], [Tech with Team], [https://www.youtube.com/watch?v=c-QsfbznSXI]
*  Accessed: [09/03/2025]
*/

function Login() {
    return <Form route="/api/token/" method="login" />
}

export default Login