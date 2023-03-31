<?php

namespace App;

class Utils
{
    public static function htmlSpecChar(string $str): string
    {
        return htmlspecialchars($str, double_encode: false);
    }
}
