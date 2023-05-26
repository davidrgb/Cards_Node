export default function Login() {
    return (
        <div>
            <h1>Login/Sign Up</h1>
            <form method="post">
                <input type="text" placeholder="Username"></input>
                <input type="password" placeholder="Password"></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}