/*
zap-db

An easy to use JSON database created for memory management of slack bots

API version: 1.0.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package openapi

import (
	"encoding/json"
)

// CreateDatabaseRes response body for create database by admin
type CreateDatabaseRes struct {
	Message *string `json:"message,omitempty"`
	Token *string `json:"token,omitempty"`
}

// NewCreateDatabaseRes instantiates a new CreateDatabaseRes object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewCreateDatabaseRes() *CreateDatabaseRes {
	this := CreateDatabaseRes{}
	return &this
}

// NewCreateDatabaseResWithDefaults instantiates a new CreateDatabaseRes object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewCreateDatabaseResWithDefaults() *CreateDatabaseRes {
	this := CreateDatabaseRes{}
	return &this
}

// GetMessage returns the Message field value if set, zero value otherwise.
func (o *CreateDatabaseRes) GetMessage() string {
	if o == nil || o.Message == nil {
		var ret string
		return ret
	}
	return *o.Message
}

// GetMessageOk returns a tuple with the Message field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *CreateDatabaseRes) GetMessageOk() (*string, bool) {
	if o == nil || o.Message == nil {
		return nil, false
	}
	return o.Message, true
}

// HasMessage returns a boolean if a field has been set.
func (o *CreateDatabaseRes) HasMessage() bool {
	if o != nil && o.Message != nil {
		return true
	}

	return false
}

// SetMessage gets a reference to the given string and assigns it to the Message field.
func (o *CreateDatabaseRes) SetMessage(v string) {
	o.Message = &v
}

// GetToken returns the Token field value if set, zero value otherwise.
func (o *CreateDatabaseRes) GetToken() string {
	if o == nil || o.Token == nil {
		var ret string
		return ret
	}
	return *o.Token
}

// GetTokenOk returns a tuple with the Token field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *CreateDatabaseRes) GetTokenOk() (*string, bool) {
	if o == nil || o.Token == nil {
		return nil, false
	}
	return o.Token, true
}

// HasToken returns a boolean if a field has been set.
func (o *CreateDatabaseRes) HasToken() bool {
	if o != nil && o.Token != nil {
		return true
	}

	return false
}

// SetToken gets a reference to the given string and assigns it to the Token field.
func (o *CreateDatabaseRes) SetToken(v string) {
	o.Token = &v
}

func (o CreateDatabaseRes) MarshalJSON() ([]byte, error) {
	toSerialize := map[string]interface{}{}
	if o.Message != nil {
		toSerialize["message"] = o.Message
	}
	if o.Token != nil {
		toSerialize["token"] = o.Token
	}
	return json.Marshal(toSerialize)
}

type NullableCreateDatabaseRes struct {
	value *CreateDatabaseRes
	isSet bool
}

func (v NullableCreateDatabaseRes) Get() *CreateDatabaseRes {
	return v.value
}

func (v *NullableCreateDatabaseRes) Set(val *CreateDatabaseRes) {
	v.value = val
	v.isSet = true
}

func (v NullableCreateDatabaseRes) IsSet() bool {
	return v.isSet
}

func (v *NullableCreateDatabaseRes) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableCreateDatabaseRes(val *CreateDatabaseRes) *NullableCreateDatabaseRes {
	return &NullableCreateDatabaseRes{value: val, isSet: true}
}

func (v NullableCreateDatabaseRes) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableCreateDatabaseRes) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


