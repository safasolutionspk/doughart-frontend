import { redirect } from "next/navigation";

export default function CakesIndexPage() {
  redirect("/cakes/all");
}
