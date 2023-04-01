<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use SoftDeletes;
    protected $table = 'article';
    protected $dateFormat = 'Y-m-d H:i:s';
    protected $casts = [
        'id' => 'integer',
        'title' => 'string',
        'content' => 'string',
        'uid' => 'integer',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'uid');
    }
}
