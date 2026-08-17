import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const userEmail = session.user.email;
  const supabase = getSupabase();

  try {
    const [
      { data: progress, error: progErr },
      { data: srsCards, error: srsErr },
      { data: categoryStats, error: catErr },
      { data: dailyStats, error: dayErr },
    ] = await Promise.all([
      supabase
        .from("mt_trivia_progress")
        .select(
          "total_answered, total_correct, streak, longest_streak, last_played_date, level, xp"
        )
        .eq("user_email", userEmail)
        .maybeSingle(),
      supabase
        .from("mt_trivia_srs_cards")
        .select(
          "id, question, answer, category, explanation, interval, repetition, ease_factor, next_review, last_review"
        )
        .eq("user_email", userEmail)
        .order("next_review"),
      supabase
        .from("mt_trivia_category_stats")
        .select("category, answered, correct")
        .eq("user_email", userEmail),
      supabase
        .from("mt_trivia_daily_stats")
        .select("date, answered, correct")
        .eq("user_email", userEmail)
        .order("date", { ascending: false })
        .limit(100),
    ]);

    if (progErr || srsErr || catErr || dayErr) {
      console.error("[trivia-progress GET]", progErr || srsErr || catErr || dayErr);
      return new Response("Failed to load trivia progress", { status: 500 });
    }

    return NextResponse.json({
      progress: progress || {
        total_answered: 0,
        total_correct: 0,
        streak: 0,
        longest_streak: 0,
        last_played_date: null,
        level: 1,
        xp: 0,
      },
      srsCards: srsCards || [],
      categoryStats: categoryStats || [],
      dailyStats: dailyStats || [],
    });
  } catch (e) {
    console.error("[trivia-progress GET error]", e);
    return new Response("Server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  const userEmail = session.user.email;
  const supabase = getSupabase();
  const body = await req.json();
  const { action } = body;

  try {
    if (action === "updateProgress") {
      const {
        totalAnswered,
        totalCorrect,
        streak,
        longestStreak,
        lastPlayedDate,
        level,
        xp,
      } = body;

      const { error } = await supabase.from("mt_trivia_progress").upsert(
        {
          user_email: userEmail,
          total_answered: totalAnswered,
          total_correct: totalCorrect,
          streak,
          longest_streak: longestStreak,
          last_played_date: lastPlayedDate,
          level,
          xp,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_email" }
      );

      if (error) {
        console.error("[trivia updateProgress error]", error);
        return new Response("Failed to update progress", { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "upsertSRSCard") {
      const {
        id,
        question,
        answer,
        category,
        explanation,
        interval,
        repetition,
        easeFactor,
        nextReview,
        lastReview,
      } = body;

      const { error } = await supabase.from("mt_trivia_srs_cards").upsert(
        {
          id,
          user_email: userEmail,
          question,
          answer,
          category,
          explanation,
          interval,
          repetition,
          ease_factor: easeFactor,
          next_review: nextReview,
          last_review: lastReview,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("[trivia upsertSRSCard error]", error);
        return new Response("Failed to save SRS card", { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "deleteSRSCard") {
      const { id } = body;

      const { error } = await supabase
        .from("mt_trivia_srs_cards")
        .delete()
        .eq("id", id)
        .eq("user_email", userEmail);

      if (error) {
        console.error("[trivia deleteSRSCard error]", error);
        return new Response("Failed to delete SRS card", { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "updateCategoryStats") {
      const { category, answered, correct } = body;

      const { error } = await supabase
        .from("mt_trivia_category_stats")
        .upsert(
          {
            user_email: userEmail,
            category,
            answered,
            correct,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_email,category" }
        );

      if (error) {
        console.error("[trivia updateCategoryStats error]", error);
        return new Response("Failed to update category stats", { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "updateDailyStats") {
      const { date, answered, correct } = body;

      const { error } = await supabase
        .from("mt_trivia_daily_stats")
        .upsert(
          {
            user_email: userEmail,
            date,
            answered,
            correct,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_email,date" }
        );

      if (error) {
        console.error("[trivia updateDailyStats error]", error);
        return new Response("Failed to update daily stats", { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === "logSession") {
      const { quizType, category, questionsCount, correctCount } = body;

      const { error } = await supabase.from("mt_trivia_sessions").insert({
        user_email: userEmail,
        quiz_type: quizType,
        category,
        questions_count: questionsCount,
        correct_count: correctCount,
      });

      if (error) {
        console.error("[trivia logSession error]", error);
        return new Response("Failed to log session", { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    return new Response("Unknown action", { status: 400 });
  } catch (e) {
    console.error("[trivia-progress POST error]", e);
    return new Response("Server error", { status: 500 });
  }
}
