#!/bin/bash

set -e

display_usage() { 
	cat <<EOL
  Downloads external files and builds Hugo markdown files.
  
  Usage: `basename $0` directory ["true": use oauth]

  Example: `basename $0` ./external true

  Optional: 
  - Set OAUTH_TOKEN environment variable
  - Set HTTP_PROXY environment variable

  Dependencies: yq from https://github.com/mikefarah/yq
EOL
} 

# download external content and append to file
process_file() {
  _yq() {
    cat ${1} | sed -n '/---/,/---/p'  | yq r - "${2}"
  }

  echo "Processing: ${1}"

  title="$(_yq ${1} 'title')"
  file="$(_yq ${1} 'file')"
  canonicalUrl="$(_yq ${1} 'canonicalUrl')"
  repository="$(_yq ${1} 'repository')"
  sed="$(_yq ${1} 'sed')"

  # validate required keys
  [[ "${file}" == "null" ]] && echo "${1}: file is unset or set to the empty string. Skipping." && return 0
  [[ "${title}" == "null" ]] && echo "${1}: title is unset or set to the empty string. Skipping." && return 0
  [[ "${canonicalUrl}" == "null" ]] && echo "${1}: canonicalUrl is unset or set to the empty string. Skipping." && return 0
  
  # generate repository message if defined
  #[[ "${repository}" != "null" ]] && repositoryMsg=" located in this [repository](${repository})." || repositoryMsg="."

  # Download file
  proto="$(echo $canonicalUrl | grep :// | sed -e's,^\(.*://\).*,\1,g')"
  url="$(echo ${canonicalUrl/$proto/})"
  body=$(curl -k ${proxyArg} -H "Accept: text/plain" -L "${proto}${oauthPrefix}${url}")

  # Skip if body is empty
  [[ -z "${body}" ]] && echo "${1}: Source file is empty or an error occurred while trying to get it. Skipping." && return 0
  
  # cat external .md file contents to new file
  cat "${1}" > $file

  # Process file using sed or output raw results
  [[ "${sed}" != "null" ]] && echo "${body}" | sed -e "${sed}" >> $file || echo "$body" >> $file

}

# start

command -v yq >/dev/null 2>&1 || { echo >&2 "yq from https://github.com/mikefarah/yq but it's not installed.  Aborting."; exit 1; }

# check for external directory in command line arguments
[[ -z "${1}" ]] && display_usage && exit 1

# assign url prefix if OAUTH_TOKEN env variable is set
[[ -z "${OAUTH_TOKEN}" ]] && oauthPrefix="" || oauthPrefix="oauth:${OAUTH_TOKEN}@"

# assign curl proxy arguments depending on whether HTTP_PROXY env variable is set
[[ "x${HTTP_PROXY}" = "x" ]] && proxyArg="" || proxyArg="--proxy ${HTTP_PROXY} --proxy-user user:password"

# assign OAUTH url prefix
[[ "x${2}" == "xtrue" ]] && oauthPrefix="oauth:${OAUTH_TOKEN}@" || oauthPrefix=""

# find all .md files in external directory and process
find ${1} -maxdepth 1 -name "*.md" -type f -print0 |
  while IFS= read -rd '' inputFile; do 
    process_file ${inputFile}
  done