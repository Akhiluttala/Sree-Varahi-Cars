const form = document.getElementById('enquiry');
if (form) {
  const fields = form.elements;
  const params = new URLSearchParams(location.search);
  const draft = document.getElementById('draft');
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  fields.date.min = today.toISOString().slice(0, 10);
  if (['visit','buy','sell'].includes(params.get('type'))) fields.type.value = params.get('type');
  fields.interest.value = (params.get('interest') || '').slice(0, 120);
  function updateFields() {
    for (const label of form.querySelectorAll('[data-mode]')) {
      const active = label.dataset.mode === fields.type.value;
      label.hidden = !active;
      const input = label.querySelector('input');
      input.disabled = !active;
      input.required = active && input.name !== 'km';
    }
    draft.hidden = true;
  }
  updateFields();
  fields.type.addEventListener('change', updateFields);
  form.addEventListener('input', () => { draft.hidden = true; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = ['Hello Sree Varahi Cars, my name is ' + data.get('name').trim() + '.'];
    if (data.get('type') === 'visit') lines.push('I would like to visit the showroom on ' + data.get('date') + '. Please confirm availability.');
    if (data.get('type') === 'buy') lines.push('I am looking to buy a car. My preference is ' + data.get('interest').trim() + '. What is currently available?');
    if (data.get('type') === 'sell') {
      lines.push('I would like to sell my ' + data.get('model').trim() + '.');
      if (data.get('km')) lines.push('Kilometres driven: ' + data.get('km'));
    }
    if (data.get('note').trim()) lines.push(data.get('note').trim());
    const message = lines.join('\n');
    document.getElementById('preview').textContent = message;
    const link = document.getElementById('send');
    link.href = 'https://wa.me/919052525553?text=' + encodeURIComponent(message);
    draft.hidden = false;
    link.focus();
  });
}
