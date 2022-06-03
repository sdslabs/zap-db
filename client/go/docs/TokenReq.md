# TokenReq

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Token** | Pointer to **string** |  | [optional] 
**Scopes** | Pointer to **string** |  | [optional] 

## Methods

### NewTokenReq

`func NewTokenReq() *TokenReq`

NewTokenReq instantiates a new TokenReq object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTokenReqWithDefaults

`func NewTokenReqWithDefaults() *TokenReq`

NewTokenReqWithDefaults instantiates a new TokenReq object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetToken

`func (o *TokenReq) GetToken() string`

GetToken returns the Token field if non-nil, zero value otherwise.

### GetTokenOk

`func (o *TokenReq) GetTokenOk() (*string, bool)`

GetTokenOk returns a tuple with the Token field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToken

`func (o *TokenReq) SetToken(v string)`

SetToken sets Token field to given value.

### HasToken

`func (o *TokenReq) HasToken() bool`

HasToken returns a boolean if a field has been set.

### GetScopes

`func (o *TokenReq) GetScopes() string`

GetScopes returns the Scopes field if non-nil, zero value otherwise.

### GetScopesOk

`func (o *TokenReq) GetScopesOk() (*string, bool)`

GetScopesOk returns a tuple with the Scopes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopes

`func (o *TokenReq) SetScopes(v string)`

SetScopes sets Scopes field to given value.

### HasScopes

`func (o *TokenReq) HasScopes() bool`

HasScopes returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


