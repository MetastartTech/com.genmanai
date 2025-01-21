import Header from "@/components/common/header";
import SigninForm from "@/components/signin/signin-form";

const SignIn = () => {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-121px)] flex items-center justify-center">
        <SigninForm />
      </div>
    </>
  );
};

export default SignIn;
