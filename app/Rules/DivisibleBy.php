<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class DivisibleBy implements Rule
{
    protected $divisor;

    public function __construct($divisor)
    {
        $this->divisor = $divisor;
    }

    public function passes($attribute, $value)
    {
        return $value % $this->divisor === 0;
    }

    public function message()
    {
        return 'The :attribute must be divisible by ' . $this->divisor . '.';
    }
}