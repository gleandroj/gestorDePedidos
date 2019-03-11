<?php
/**
 * Created by PhpStorm.
 * User: fabersoft
 * Date: 19/09/18
 * Time: 15:21
 */

namespace Bufallus\Support\ValidationRules;

use Illuminate\Contracts\Validation\Rule;

class Cellphone implements Rule
{

    const REGEX = '/\([0-9]{2}\) [0-9]{5}-[0-9]{4}/';
    private $attribute;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string $attribute
     * @param  mixed $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $this->attribute = $attribute;
        return boolval(preg_match(self::REGEX, $value));
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.cellphone', [
            'attribute' => $this->attribute
        ]);
    }
}