<?php

namespace Bufallus\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Bufallus\Models\User;
use Bufallus\Support\ValidationRules\Cellphone;

class CreateOrUpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'table' => 'required',
            'is_done' => ['nullable', 'boolean'],
            'items.*.item_id' => ['required', Rule::exists('items', 'id')],
            'items.*.quantity' => ['required', 'min:1', 'numeric'],
            'items.*.price' => ['required', 'min:0', 'numeric'],
            'items.*.cost' => ['required', 'min:0', 'numeric'],
            'items.*.discount' => ['nullable', 'min:0', 'numeric'],
            'items.*.observation' => ['nullable', 'string'],
            'items.*.is_done' => ['nullable', 'boolean'],
        ];
    }
}
