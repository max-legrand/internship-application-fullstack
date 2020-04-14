addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Gets cookie value for given name
 * @param {Request} request 
 * @param {String} name 
 * @returns {String} cookie value
 */
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
      let cookies = cookieString.split(';')
      cookies.forEach(cookie => {
          let cookieName = cookie.split('=')[0].trim()
          if (cookieName === name) {
              let cookieVal = cookie.split('=')[1]
              result = cookieVal
          }
      })
  }
  return result
}

async function handleRequest(request) {

    var cookieurl = getCookie(request, "URL")
    // console.log(cookieurl)
    /**
    * gets Json from cloudflare and returns promise
    */
    async function getJson(){
      var myresponse = await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
      var data = await myresponse.json()
      return data
    }
    result = getJson()
    var myurl
    var resp = result.then(async data => {
      var randomindex
      if (Math.random() >= 0.5){
        randomindex=1
      }
      else{
        randomindex=0
      }
      var array = data["variants"]
      console.log(array)
      console.log(randomindex)
      myurl = array[randomindex]
      console.log(cookieurl)
      if (cookieurl!=null){
        myurl = cookieurl
      }
      console.log(myurl)

      var siteresp = await fetch(myurl)
      var newresp = new HTMLRewriter()
        .on('title', {element(element){
          element.setInnerContent("ML - Cloudflare challenge")
          }
        })

        .on('h1#title', {element(element){
            if (myurl.search("1") != -1){
              element.setInnerContent("Number 1")
            }
            else{
              element.setInnerContent("Number 2")
            }
          }
        })

        .on('p#description', {element(element){
            if (myurl.search("1") != -1){
              element.setInnerContent("Number 1 variant for cloudflare programming challenge")
            }
            else{
              element.setInnerContent("Number 2 variant for cloudflare programming challenge")
            }
          }
        })

        .on('a#url', {element(element){
          element.setAttribute('href', 'https://www.linkedin.com/in/maxwell-legrand')
          element.setInnerContent("Connect with me on LinkedIn!")
        }
      })

      .transform(siteresp)

      newresp.headers.append('Set-Cookie', 'URL='+myurl+'; Secure; HttpOnly; path=/;')
      return newresp

    })
    return resp
}
  