import Header from "@/components/common/header";
import SignupForm from "@/components/signup/signup-form";

const SignUp = () => {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-121px)] flex items-center justify-center">
        <SignupForm />
      </div>
    </>
  );
};

export default SignUp;
