"use client";
import axios from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { useRouter } from "next/navigation";
interface IsSignUpInfo {
  result: [string];
}
export default function IsSignUpInfo() {
  const fetchIsSignUp = async () => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl.split("?")[1]);
    const accessToken = urlParams.get("access-token");
    const refreshToken = urlParams.get("refresh-token");
    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}; path=/`;
    }
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
    }
    const response = await axios({
      method: "get",
      url: `https://j10a207.p.ssafy.io/api/member/privilege/check`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  };

  const { data, isLoading, error }: UseQueryResult<IsSignUpInfo, Error> =
    useQuery("signUpInfo", fetchIsSignUp);
  if (isLoading) {
    return <div className="rainbow"></div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const { result }: { result: [string] | null } = data
    ? data
    : { result: null };

  const router = useRouter();

  if (result && result[0] === "USER") {
    router.push("/multi");
  } else {
    router.push("login/signup");
  }
  return <div className="rainbow"></div>;
}
