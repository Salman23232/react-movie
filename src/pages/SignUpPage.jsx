import { SignUp } from '@clerk/clerk-react'

const SignUpPage = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '100px 0',
      backgroundColor: '#141414',
    }}
  >
    <SignUp signInUrl="/sign-in" forceRedirectUrl="/" />
  </div>
)

export default SignUpPage
