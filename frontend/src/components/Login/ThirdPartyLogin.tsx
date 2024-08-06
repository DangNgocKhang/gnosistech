import ButtonLoginWithGoogle from "./components/ButtonLoginWithGoogle";

const ThirdPartyLogin = () => {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <hr />
      <div className="text-center font-semibold text-xl">or</div>
      <ButtonLoginWithGoogle />
    </div>
  );
};

export default ThirdPartyLogin;
