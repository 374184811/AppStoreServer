import os

version = os.system('git')

if version:
	print('环境校验成功.')
else:
	print("git 暂未安装.")
	return

print("查看工作区文件状态.")

status = os.system('git status')
