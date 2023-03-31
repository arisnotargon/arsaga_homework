<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use SoftDeletes;
    protected $table = 'article';
    protected $casts = [
        'id' => 'integer',
        'title' => 'string',
        'content' => 'string',
        'uid' => 'integer',
        'created_at' => 'string',
        'updated_at' => 'string',
    ];

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'uid');
    }
}
