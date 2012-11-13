from bottle import route, run, template, redirect

@route('/hello/:name')
def index(name='World'):
    return template('<b>Hello {{name}}</b>!', name=name)

@route('/')
def index():
    redirect("/static/index.html")


from bottle import static_file
@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')


run(host='0.0.0.0', port=8080)