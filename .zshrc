# Lines configured by zsh-newuser-install
HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000
setopt autocd extendedglob
bindkey -e
# End of lines configured by zsh-newuser-install
# The following lines were added by compinstall
zstyle :compinstall filename '/home/steve/.zshrc'

autoload -Uz compinit
compinit
# End of lines added by compinstall

source /usr/share/doc/pkgfile/command-not-found.zsh

[ -n "$TMUX" ] && export TERM=screen-256color

export MAIL='~/Maildir'
PATH="${PATH}:/home/steve/bin"

man() {
	env \
		LESS_TERMCAP_mb=$(printf "\e[1;31m") \
		LESS_TERMCAP_md=$(printf "\e[1;31m") \
		LESS_TERMCAP_me=$(printf "\e[0m") \
		LESS_TERMCAP_se=$(printf "\e[0m") \
		LESS_TERMCAP_so=$(printf "\e[1;44;33m") \
		LESS_TERMCAP_ue=$(printf "\e[0m") \
		LESS_TERMCAP_us=$(printf "\e[1;32m") \
			man "$@"
}

alias pac='sudo pacman -S'
alias update='sudo pacman -Syu'
alias aur='aurget -S'
alias ls='ls --color=auto'
alias tmux='tmux -2'
alias grep='grep --color=auto' 

eval $(dircolors ~/.dircolors)

		
autoload -U promptinit
promptinit
