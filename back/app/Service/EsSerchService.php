<?php

namespace App\Service;

class EsSerchService
{
    private $index = '';
    private $from = 0;
    private $size = 0;
    private $query = [];

    public function index(string $index): EsSerchService
    {
        $this->index = $index;

        return $this;
    }

    public function from(int $from): EsSerchService
    {
        $this->from = $from;

        return $this;
    }

    public function size(int $size): EsSerchService
    {
        $this->size = $size;

        return $this;
    }

    public function setQuery(array $q): EsSerchService
    {
        $this->query = $q;

        return $this;
    }

    public function getQuery(): array
    {
        return $this->query;
    }

    public function search()
    {
        $param = [
            'index' => $this->index,
        ];
        if ($this->size > 0) {
            $param['size'] = $this->size;
        }
        if ($this->from > 0) {
            $param['from'] = $this->from;
        }
        if (!empty($this->query)) {
            $param['body']['query'] = $this->query;
        }

        $client = app('es');

        return $client->search($param)->asArray();
    }
}
