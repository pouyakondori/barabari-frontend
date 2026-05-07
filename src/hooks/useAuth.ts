"use client";

import { useState, useEffect, useCallback } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import type { User, AuthPayload } from "@/lib/types";
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
} from "@/graphql/mutations/auth";

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
      role
      isVerified
      createdAt
    }
  }
`;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: meData, refetch: refetchMe } = useQuery<{ me: User | null }>(ME_QUERY, {
    skip:
      typeof window === "undefined" ||
      !localStorage.getItem("accessToken"),
  });

  useEffect(() => {
    if (meData?.me) {
      setUser(meData.me);
      setLoading(false);
    } else if (
      typeof window !== "undefined" &&
      !localStorage.getItem("accessToken")
    ) {
      setLoading(false);
    }
  }, [meData]);

  const [loginMutation] = useMutation<{ login: AuthPayload }>(LOGIN_MUTATION);
  const [registerMutation] = useMutation<{ register: AuthPayload }>(REGISTER_MUTATION);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await loginMutation({
        variables: { input: { email, password } },
      });
      const payload: AuthPayload = data!.login;
      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
      setUser(payload.user);
      return payload.user;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      const { data } = await registerMutation({
        variables: { input: { email, password, displayName } },
      });
      const payload: AuthPayload = data!.register;
      localStorage.setItem("accessToken", payload.accessToken);
      localStorage.setItem("refreshToken", payload.refreshToken);
      setUser(payload.user);
      return payload.user;
    },
    [registerMutation],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  return { user, loading, login, register, logout, refetchMe };
}
