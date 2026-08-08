"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

export async function trackArticleRead(digestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("read_articles")
    .upsert([{
      user_id: user.id,
      digest_id: digestId,
      read_at: new Date().toISOString(),
    }]);

  if (error) {
    console.error("Error tracking article read:", error);
  }
}

export async function submitQuizAttempt(quizId: string, isCorrect: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const scoreEarned = isCorrect ? 10 : 0;

  const { error } = await supabase
    .from("quiz_attempts")
    .insert([{
      user_id: user.id,
      quiz_id: quizId,
      is_correct: isCorrect,
      score_earned: scoreEarned,
    }]);

  if (error) {
    console.error("Error submitting quiz attempt:", error);
    return false;
  }

  if (isCorrect) {
    await supabase.rpc("increment_user_xp", { user_id_param: user.id, xp_to_add: scoreEarned });
  }

  revalidatePath("/");
  revalidatePath("/tracker");
  return true;
}

export type AdminStatus = "passed" | "flagged" | "quarantined";

/** Admin-only action: update a digest's factual rating from the editorial dashboard. */
export async function updateDigestAdminStatus(id: string, status: AdminStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthenticated" };

  const isAdmin = user?.user_metadata?.role === "admin" || user?.email?.endsWith("@gyan.ai");
  if (!isAdmin) return { ok: false, error: "Forbidden" };

  const { error } = await supabase
    .from("digests")
    .update({ factual_rating: status })
    .eq("id", id);

  if (error) {
    console.error("Error updating digest status:", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/bookmarks");
  return { ok: true };
}
