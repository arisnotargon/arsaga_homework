<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use App\Service\EsSerchService;
use App\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ArticleController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $user = auth('api')->user();
        $validatedData['uid'] = $user->id;
        $validatedData['title'] = Utils::htmlSpecChar($validatedData['title']);
        $validatedData['content'] = Utils::htmlSpecChar($validatedData['content']);

        $res = Article::query()->create($validatedData);
        if (!$res instanceof Article) {
            return response()->json(['error'], 500);
        }

        return response()->json("success");
    }

    public function update(Request $request, int $id)
    {
        $article = Article::query()->findOrFail($id);
        $user = auth('api')->user();
        if ($article->uid !== $user->id) {
            // 権限
            return response()->json(['error'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);
        $validatedData['title'] = Utils::htmlSpecChar($validatedData['title']);
        $validatedData['content'] = Utils::htmlSpecChar($validatedData['content']);
        $res = $article->update($validatedData);

        if ($res !== true) {
            return response()->json(['error'], 500);
        }

        return response()->json(['success']);
    }

    public function delete(int $id)
    {
        $article = Article::query()->findOrFail($id);
        $user = auth('api')->user();
        if ($article->uid !== $user->id) {
            // 権限
            return response()->json(['error'], 403);
        }
        $res = $article->delete();

        if ($res !== true) {
            return response()->json(['error'], 500);
        }

        return response()->json(['success']);
    }

    public function list(Request $request)
    {
        $pageSize = 5;

        $page = (int)$request->input('page', 1);
        $page = $page < 1 ? 1 : $page;

        $keyword = $request->input('keyword', 1);
        $keyword = preg_replace("/ +/", ' ', $keyword);
        $keyword = explode(' ', $keyword);

        $offset = ($page - 1) * $pageSize;

        $query = Article::query();
        $count = 0;
        if (!empty($keyword[0])) {
            // search
            $esService = new EsSerchService();
            $esService
                ->index('article')
                ->size($pageSize)
                ->from($offset);
            $esCondition = [];
            foreach ($keyword as $kw) {
                $esCondition[] = ['wildcard' => ['content' => '*' . $kw . '*']];
                $esCondition[] = ['wildcard' => ['title' => '*' . $kw . '*']];
            }
            $esQuery = ['bool' => ['should' => $esCondition]];
            $esService->setQuery($esQuery);
            $esRes = $esService->search();
            $count = $esRes['hits']['total']['value'];
            $hits = collect($esRes['hits']['hits']);
            $ids = $hits->pluck('_source')->pluck('id')->toArray();
            $query = $query->whereIn('id', $ids);
        } else {
            $query = $query->skip($offset)
                ->take($pageSize);
            $count = $query->count();
        }

        $list = $query
            ->with('user')
            ->orderBy('id', 'desc')
            ->get()->toArray();

        $totalPage = ceil($count / $pageSize);
        foreach ($list as $k => $article) {
            $article['uname'] = $article['user']['name'];
            unset($article['user']);
            $list[$k] = $article;
        }

        return response()->json([
            'list' => $list,
            'totalPage' => $totalPage
        ]);
    }

    public function detail(Request $request, int $id)
    {
        $article = Article::query()->findOrFail($id);
        $user = User::query()->findOrFail($article->uid);
        $article->uname = $user->name;
        return response()->json($article);
    }
}
