
#include <node.h>

using namespace v8;
 
void fromProxy(const FunctionCallbackInfo<Value> &info) {
	auto isolate = info.GetIsolate();
	if (info[0]->IsProxy())
	{
		auto temp = info[0].As<Proxy>();
		Local<Value> out[] = { temp->GetTarget(), temp->GetHandler() };
		info.GetReturnValue().Set(Array::New(isolate, out, 2));
	}
	else info.GetReturnValue().Set(Null(isolate));
}

void fromPromise(const FunctionCallbackInfo<Value> &info) {
	auto isolate = info.GetIsolate();
	if (info[0]->IsPromise())
	{
		auto temp = info[0].As<Promise>();
		auto state = temp->State();
		auto value = state == Promise::PromiseState::kPending ? (Local<Value>)Null(isolate) : temp->Result();
		Local<Value> out[] = { Number::New(isolate, state), value };
		info.GetReturnValue().Set(Array::New(isolate, out, 2));
	}
	else info.GetReturnValue().Set(Null(isolate));
}

void getOwnPrivateSymbols(const FunctionCallbackInfo<Value> &info) {
	auto isolate = info.GetIsolate();
	auto result = !info[0]->IsObject()
		? (Local<Value>)Null(isolate)
		: info[0].As<Object>()->GetPropertyNames(
			isolate->GetCurrentContext(),
			KeyCollectionMode::kOwnOnly,			// Doesn't search on the prototype
			(PropertyFilter)64,						// Only private properties (The number is raw because it is apparently defined only on debug mode)
			IndexFilter::kSkipIndices,				// Skip the number indices
			KeyConversionMode::kNoNumbers			// Do not convert the numbers keys (Which should not be present) to actual numbers
		).ToLocalChecked();
	info.GetReturnValue().Set(result);
}

void init(Local<Object> exports, Local<Value> module, Local<Context> context) {
	NODE_SET_METHOD(exports, "fromProxy", fromProxy);
	NODE_SET_METHOD(exports, "fromPromise", fromPromise);
	NODE_SET_METHOD(exports, "getOwnPrivateSymbols", getOwnPrivateSymbols);
}

NODE_MODULE(internal, init)