<?php

namespace Bufallus\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Bufallus\Models\User;
use Bufallus\Support\ValidationRules\Cellphone;

class CreateOrUpdateOrderItemRequest extends FormRequest
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
            'item_id' => ['required', Rule::exists('items', 'id')],
            'parent_id' => ['nullable', Rule::exists('order_items', 'id')],
            'quantity' => ['required', 'min:1', 'numeric'],
            'price' => ['required', 'min:0', 'numeric'],
            'cost' => ['required', 'min:0', 'numeric'],
            'discount' => ['nullable', 'min:0', 'numeric'],
            'observation' => ['nullable', 'string'],
            'is_done' => ['nullable', 'boolean'],
        ];
    }
}
