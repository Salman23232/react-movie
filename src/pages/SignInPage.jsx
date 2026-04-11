import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '100px 0',
      backgroundColor: '#141414',
    }}
  >
    <SignIn signUpUrl="/sign-up" forceRedirectUrl="/" />
  </div>
)

export default SignInPage
