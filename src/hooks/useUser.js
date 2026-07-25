import { useAuth } from "../contexts/AuthContext";

export default function useUser() {
  return useAuth();
}