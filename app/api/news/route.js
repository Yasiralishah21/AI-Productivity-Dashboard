// export async function GET(request) {
//     try {
//         const response = await fetch(
//             "https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=YOUR_API_KEY",
//             { cache: "no-store" }
//         );
//         if (!response.ok) {
//             throw new Error("Failed to fetch news");
//         }
//         const data = await response.json();

//         const articles = data.results.map((article) => ({
//             title: article.title,
//             url: article.url,
//             source: article.news_site,
//           }));

//         return Response.json({articles});
//     }
//     catch (error) {
//         return Response.json(
//             { error: "Unable to fetch news" },
//             { status: 500 }
//           );
//     }
// }




// export async function GET() {
//     try {
//       const response = await fetch(
//         "https://api.spaceflightnewsapi.net/v4/articles?limit=5",
//         { cache: "no-store" }
//       );
  
//       if (!response.ok) {
//         return Response.json(
//           { error: "News API failed", status: response.status },
//           { status: 500 }
//         );
//       }
  
//       const data = await response.json();
  
//       const articles = data.results.map((article) => ({
//         title: article.title,
//         url: article.url,
//         source: article.news_site,
//       }));
  
//       return Response.json({ articles });
  
//     } catch (error) {
//       return Response.json(
//         { error: "Unable to fetch news" },
//         { status: 500 }
//       );
//     }
//   }




import { NextResponse } from "next/server";

// In-memory rotation tracker (dev only)
let lastIndex = 0;

export async function GET(request) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "News API key missing" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim();
    const query = city ? `${city} news` : "technology";

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "News API failed", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    // ✅ Rotate 5 articles per request
    const total = data.articles.length;
    const rotateCount = 5;

    // Compute slice indices
    const start = lastIndex % total;
    const end = start + rotateCount;

    // Rotate articles and update lastIndex
    const rotatedArticles = data.articles
      .slice(start, end > total ? total : end)
      .map((article) => ({
        title: article.title,
        url: article.url,
        source: article.source.name,
      }));

    lastIndex = end % total; // update for next request

    return NextResponse.json({ articles: rotatedArticles });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Unable to fetch news" }, { status: 500 });
  }
}