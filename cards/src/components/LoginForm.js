import './LoginForm.css';

export default function LoginForm() {

    // Fade classes used for animations on Login page

    return (
        <form method="post">
            <div className="login-form-group">
                <input className='fade second-fade' type="text" placeholder="Username"></input>
                <input className='fade third-fade' type="password" placeholder="Password"></input>
            </div>
            <div className="login-form-group">
                <button className='fade fourth-fade' type="submit">Sign Up</button>
                <button className='fade fifth-fade' type="submit">Login</button>
            </div>
        </form>
    );
}