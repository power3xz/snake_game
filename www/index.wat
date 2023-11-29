(module
  (import "console" "log" (func $log))
  (import "console" "error" (func $error))
  (memory $mem 1)
  (data (i32.const 0) "Hi")
  (func $sum (param $a i32) (param $b i32) (result i32)
    call $log
    call $error
    local.get $a
    local.get $b i32.add
  )
  (export "mem" (memory $mem))
  (export "sum" (func $sum))
)
