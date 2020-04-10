import React from "react";
import Nav from "./Nav";
import { MeLocalQuery } from "../generated/graphql";

interface Props {
  user: MeLocalQuery | undefined
  loading: boolean
};

export const Header: React.FC<Props> = ({ user, loading }) => (
  <header>
    <Nav user={user} loading={loading} />
  </header>
)